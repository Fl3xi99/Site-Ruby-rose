const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Parse the incoming request body
  const { product_id } = JSON.parse(event.body || '{}');

  // Map product_id to Stripe price IDs
  const productMap = {
    'custom-tshirt': {
      price: 'price_1RZzGrEHGuwqtX444rKZwTj6', // 🔁 Replace with your actual Stripe Price ID
      name: 'Custom T-Shirt'
    },
    'Portefeulle': {
      price: 'price_1RZzGrEHGuwqtX444rKZwTj6', // 🔁 Replace with your actual Stripe Price ID
      name: 'Portefeulle'
    }
  };

  const product = productMap[product_id];

  if (!product) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid product_id' }),
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: product.price,
          quantity: 1
        }
      ],
      success_url: 'https://your-site-name.netlify.app/success.html',
      cancel_url: 'https://your-site-name.netlify.app/cancel.html',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Checkout session creation failed.' }),
    };
  }
};
