import negocioModel from "../models/negocioModel.js";
import Stripe from "stripe";

const createConnectAccount = async (req, res) => {
    const frontend_url = "https://tomato-t8yt.onrender.com";
    // const frontend_url = "http://localhost:5173";
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        const { userId, name, email } = req.body;

        //1. Crear cuenta de stripe connect
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'MX', // O el país correspondiente
            email: email,
        });

        //2. Guardar el negocio y su id de cuenta en la BD
        const negocio = new negocioModel({
            userId: userId,
            nombre: name,
            correo: email,
            stripeAccountId: account.id,
        });
        await negocio.save();

        //3. Crear el link de onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${frontend_url}/stripe/return/${account.id}`,
            return_url: `${frontend_url}/stripe/refresh/${account.id}`,
            type: 'account_onboarding',
        });

        res.json({ success: true, url: accountLink.url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error al crear la cuenta' });
    }

};


const getOnboardingLink = async (req, res) => {
    const frontend_url = "https://tomato-t8yt.onrender.com";
    // const frontend_url = "http://localhost:5173";
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const { accountId } = req.params;

        // Verificamos si el accountId existe en la base de datos (opcional pero recomendable)
        const negocio = await negocioModel.findOne({ stripeAccountId: accountId });
        if (!negocio) {
            return res.status(404).json({ success: false, message: "Negocio no encontrado" });
        }

        // Creamos un nuevo onboarding link
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${frontend_url}/stripe/return/${accountId}`,
            return_url: `${frontend_url}/stripe/refresh/${accountId}`,
            type: "account_onboarding",
        });

        res.json({ success: true, url: accountLink.url });
    } catch (error) {
        console.error("Error al generar onboarding link:", error);
        res.status(500).json({ success: false, message: "Error al generar link de onboarding" });
    }
};

const getAccountStatus = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { accountId } = req.params;

    // Consultamos la cuenta en Stripe
    const account = await stripe.accounts.retrieve(accountId);

    // Puedes enviar solo la parte que te interese o toda la cuenta
    res.json({
      success: true,
      accountId: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      requirements: account.requirements,
      capabilities: account.capabilities,
      status: account,
    });
  } catch (error) {
    console.error("Error al obtener el estado de la cuenta:", error);
    res.status(500).json({
      success: false,
      message: "No se pudo obtener el estado de la cuenta",
    });
  }
};


const getStripeAccountId = async (req, res) => {
    try {
        const { userId} = req.body;
        console.log("idusuario",userId)
        const negocio = await negocioModel.findOne({ userId: userId });

        if (!negocio) {
            return res.status(404).json({ success: false, message: "Negocio no encontrado para este usuario" });
        }

        if (!negocio.stripeAccountId) {
            return res.status(400).json({ success: false, message: "Este negocio aún no está conectado a Stripe" });
        }

        res.json({ success: true, accountId: negocio.stripeAccountId });
    } catch (error) {
        console.error("Error al obtener Stripe Account ID por usuario", error);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
};

const getStripeAccountIdByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const negocio = await negocioModel.findOne({ correo: email });

        if (!negocio) {
            return res.status(404).json({ success: false, message: "Negocio no encontrado para este usuario" });
        }

        if (!negocio.stripeAccountId) {
            return res.status(400).json({ success: false, message: "Este negocio aún no está conectado a Stripe" });
        }

        res.json({ success: true, accountId: negocio.stripeAccountId });
    } catch (error) {
        console.error("Error al obtener Stripe Account ID por email", error);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
};

export { createConnectAccount, getStripeAccountId, getOnboardingLink, getAccountStatus, getStripeAccountIdByEmail }