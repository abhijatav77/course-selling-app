import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
const stripePromise = loadStripe("pk_test_51T1rUa2cr3FjtlkNaw3NIznnJVTzLhCagwv5XgSmWjDyq9z2IKtZlt42e0ZNF3JQP68K8vDQHnegP8dSg5uZ60oY00STwFC5gb");

createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>

)
