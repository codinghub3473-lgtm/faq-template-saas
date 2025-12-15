export default function handler(req, res) {
  res.status(200).json({
    message: "Welcome to FAQ Template API",
    version: "1.0.0",
    availableEndpoints: [
      "/api/auth",
      "/api/upload",
      "/api/save-project",
      "/api/create-checkout-session",
      "/api/stripe-webhook"
    ],
    usage: "Use /admin panel to manage your FAQs"
  });
}
