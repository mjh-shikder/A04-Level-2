import { PaymentStatus, RentalStatus, UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import Stripe from "stripe";

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


// * Confirm payment Webhook 
const confirmPayment = async (rawBody: Buffer, signature: string) => { 

    let event: Stripe.Event

    try {
         event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            config.stripe.webhook_secret
        );
    } catch (error) {
         throw new Error(`Webhook signature verification failed: ${(error as Error).message}`);
    }


    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const { rentalRequestId, userId, transactionId } = session.metadata || {};

        if (!transactionId) {
            throw new Error("Transaction ID not found in session metadata");
        }

        // Find the payment by transactionId
        const payment = await prisma.payment.findUnique({
            where: { transactionId },
        });

        if (!payment) {
            throw new Error(`Payment not found for transaction: ${transactionId}`);
        }

        if (payment.status === PaymentStatus.COMPLETED) {

             return { received: true, message: "Payment already processed" };
        }


        //* update payment and rental request

           await prisma.$transaction(async (tx) => {
            // Update the payment record
            await tx.payment.update({
                where: { transactionId },
                data: {
                    status: PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                    cardType: session.payment_method_types?.[0] || null,
                    bankTranId: session.payment_intent as string || null,
                    gatewayResponse: {
                        sessionId: session.id,
                        paymentIntent: typeof session.payment_intent === "string"
                            ? session.payment_intent
                            : session.payment_intent?.id ?? null,
                        paymentStatus: session.payment_status,
                        amountTotal: session.amount_total,
                        currency: session.currency,
                        customerEmail: session.customer_email,
                    },
                },
            });

            // Update rental request status to PAID
            if (rentalRequestId) {
                await tx.rentalRequest.update({
                    where: { id: rentalRequestId },
                    data: {
                        status: RentalStatus.PAID,
                    },
                });
            }
        });

        
        return { received: true, message: "Payment confirmed successfully" };
    }


    //* if paymet fail

     if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const { transactionId } = session.metadata || {};

        if (transactionId) {
            await prisma.payment.update({
                where: { transactionId },
                data: {
                    status: PaymentStatus.FAILED,
                    gatewayResponse: {
                        sessionId: session.id,
                        failureReason: event.type,
                    },
                },
            });
        }

        return { received: true, message: "Payment failure recorded" };
    }

    return { received: true, message: `Unhandled event type: ${event.type}` };

}


//* Get payment History 
const getPaymentHistory = async (userId: string, role: UserRole) => { 

    // For tenants: show their own payments
    // For landlords: show payments related to their properties
    // For admins: show all payments

    if (role === UserRole.ADMIN) {
        const payments = await prisma.payment.findMany({
            orderBy: { createdAt: "desc" },
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
                                images: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return payments;
    }

    if (role === UserRole.LANDLORD) {
        const payments = await prisma.payment.findMany({
            where: {
                rentalRequest: {
                    landlordId: userId,
                },
            },
            orderBy: { createdAt: "desc" },
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
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        return payments;
    }

    // Default: TENANT show only their own payments
    const payments = await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
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
                            images: true,
                        },
                    },
                },
            },
        },
    });

    return payments;
}

export const paymentService = {
    createPayment,
    confirmPayment,
    getPaymentHistory,
}