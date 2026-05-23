import './homepage.css';
import logo from '@assets/image_1777095356119.png';

const SIGNUP_ACTION = 'https://icp.unboks.org/signup';

export default function SignupPage() {
  return (
    <div className="hp-site signup-site">
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
            Create a dashboard for your business. You will receive your login by email,
            then the dashboard will guide you through WhatsApp and Agent style setup.
          </p>
          <ul>
            <li>No credit card required for the trial.</li>
            <li>Your own tenant workspace is created automatically.</li>
            <li>Marina can be tuned from inside your dashboard.</li>
          </ul>
        </section>

        <form className="signup-card" method="post" action={SIGNUP_ACTION}>
          <div>
            <h2>Create my free account</h2>
            <p>Use your real business details. These initialize your workspace.</p>
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
            Create My Free Account
          </button>

          <p className="signup-footnote">
            By continuing, you agree that Unboks will create a trial workspace and email
            your initial dashboard credentials.
          </p>
        </form>
      </main>
    </div>
  );
}
