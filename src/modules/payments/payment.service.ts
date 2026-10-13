import { PaymentStatus, RentalStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { stripe } from "../../lib/stripe";
import config from "../../config";

const createPayment = async (userId: string, payload: { rentalRequestId: string }) => { 

     const { rentalRequestId } = payload;


       if (!rentalRequestId) {
         throw new Error("Rental request ID is required");
    }

     const rentalRequest = await prisma.rentalRequest.findUnique({
       where: { id: rentalRequestId },
       include: {
         property: {
           select: {
             id: true,
             title: true,
             rent: true,
             address: true,
             city: true,
             images: true,
           },
         },
         tenant: {
           select: {
             id: true,
             name: true,
             email: true,
           },
         },
       },
     });


     if (!rentalRequest) {
       throw new Error("Rental request not found");
    }


    if (rentalRequest.tenantId !== userId) {
        throw new Error("You are not authorized to make payment for this rental request");
    }

    if (rentalRequest.status !== RentalStatus.APPROVED) {
        throw new Error(`Cannot create payment. Rental request status is "${rentalRequest.status}". Only APPROVED requests can be paid.`);
    }

    const existingPayment = await prisma.payment.findFirst({
        where: {
            rentalRequestId,
            status: PaymentStatus.COMPLETED,
        },
    });


     if (existingPayment) {
        throw new Error("Payment has already been completed for this rental request");
    }

    const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    const amount = rentalRequest.totalAmount
        ? Number(rentalRequest.totalAmount)
        : Number(rentalRequest.monthlyRent);


     const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: rentalRequest.tenant.email,
        metadata: {
            rentalRequestId,
            userId,
            transactionId,
        },
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `Rent: ${rentalRequest.property.title}`,
                        description: `Rental payment for property at ${rentalRequest.property.address}, ${rentalRequest.property.city}`,
                        images: rentalRequest.property.images.length > 0
                            ? rentalRequest.property.images.slice(0, 1)
                            : undefined,
                    },
                    unit_amount: Math.round(amount * 100), // Stripe expects amount in cents
                },
                quantity: 1,
            },
        ],
        success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/payment/cancel`,
     });

      const payment = await prisma.payment.create({
        data: {
            rentalRequestId,
            userId,
            transactionId,
            amount,
            method: "STRIPE",
            provider: "STRIPE",
            status: PaymentStatus.PENDING,
            gatewayResponse: {
                sessionId: session.id,
                sessionUrl: session.url,
            },
        },
        include: {
            rentalRequest: {
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                            rent: true,
                            address: true,
                            city: true,
                        },
                    },
                },
            },
        },
    });

    return {
        payment,
        checkoutUrl: session.url,
        sessionId: session.id,
    };
    
}


export const paymentService = {
    createPayment,
    
}