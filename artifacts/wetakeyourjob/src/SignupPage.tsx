import './homepage.css';
import Seo from './Seo';
import logo from '@assets/image_1777095356119.png';

const SIGNUP_ACTION = 'https://icp.unboks.org/signup';

export default function SignupPage() {
  return (
    <div className="hp-site signup-site">
      <Seo
        title="Start your Unboks free trial"
        description="Request a trial workspace for Unboks and start setting up your AI assistant, channels, and handoff rules."
        path="/signup"
      />

      <nav>
        <a className="nav-logo" href="/">
          <img src={logo} alt="Unboks.org" className="nav-logo-img nav-logo-img--wide" />
        </a>
        <div className="nav-actions">
          <a href="https://dashboard.unboks.org" className="btn-ghost">
            Sign in
          </a>
        </div>
      </nav>

      <main className="signup-shell">
        <section className="signup-intro">
          <div className="hero-tag">14-day free trial</div>
          <h1>Start your Unboks workspace</h1>
          <p>
            Create your business dashboard and start setting up your AI assistant,
            channels, and customer handoff rules.
          </p>
          <ul>
            <li>No credit card required for the trial.</li>
            <li>Your request is reviewed before activation.</li>
            <li>You can connect WhatsApp and tune your AI assistant from your dashboard.</li>
            <li>You stay in control: conversations can be escalated to a human whenever needed.</li>
          </ul>
        </section>

        <form className="signup-card" method="post" action={SIGNUP_ACTION}>
          <div>
            <h2>Create my free account</h2>
            <p>Use your real business details so we can prepare your workspace.</p>
          </div>

          <label>
            <span>Full name</span>
            <input name="full_name" type="text" autoComplete="name" required />
          </label>

          <label>
            <span>Business name</span>
            <input name="business_name" type="text" autoComplete="organization" required />
          </label>

          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <label>
            <span>Phone optional</span>
            <input name="phone" type="tel" autoComplete="tel" />
          </label>

          <button type="submit" className="btn-primary signup-submit">
            Request Free Trial
          </button>

          <p className="signup-footnote">
            By continuing, you agree that Unboks may create a trial workspace and
            contact you with setup instructions.
          </p>
        </form>
      </main>
    </div>
  );
}
