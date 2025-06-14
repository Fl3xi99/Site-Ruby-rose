const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = {
  'custom-tshirt': {
    name: 'Custom T Shirts',
    price: 1999, // $19.99 in cents
  },
  'portefeulle': {
    name: 'Portefeulle',
    price: 2999, // $29.99 in cents
  },
};

exports.handler = async (event) => {
  try {
    const { product_id } = JSON.parse(event.body);
    const product = PRODUCTS[product_id];

    if (!product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid product ID' }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: product.price,
            product_data: {
              name: product.name,
            },
          },
          quantity: 1,
        },
      ],
      success_url: 'https://yourdomain.netlify.app/success',
      cancel_url: 'https://yourdomain.netlify.app/cancel',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
