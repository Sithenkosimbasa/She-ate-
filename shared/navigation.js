/*
 * She Ate routing: Splash -> Sign Up -> Sign In (returning users) -> Email
 * verification -> Main Menu -> Item detail -> Cart -> Checkout.
 * Main Menu, Item detail, Cart, and Checkout require a verified Supabase user.
 * PayFast remains a prepared checkout step; payment confirmation is server-side.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const parts = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
  const fileName = parts[parts.length - 1] || '';
  const isNestedScreen = /^code\.html?$/i.test(fileName);
  const currentPage = isNestedScreen
    ? parts[parts.length - 2]
    : (fileName.replace(/\.html?$/i, '') || 'index');
  const prefix = isNestedScreen ? '../' : './';

  const routes = {
    index: `${prefix}index.html`,
    splash_screen: `${prefix}splash_screen/code.html`,
    onboarding_1: `${prefix}onboarding_1/code.html`,
    onboarding_2: `${prefix}onboarding_2/code.html`,
    auth_login: `${prefix}auth_login/code.html`,
    auth_sign_up: `${prefix}auth_sign_up/code.html`,
    auth_verify: `${prefix}auth_verify/code.html`,
    home_discovery: `${prefix}home_discovery/code.html`,
    menu_listing: `${prefix}menu_listing/code.html`,
    item_details: `${prefix}item_details/code.html`,
    cart_checkout: `${prefix}cart_checkout/code.html`,
    payment_gateway: `${prefix}payment_gateway/code.html`,
    order_tracking: `${prefix}order_tracking/code.html`,
    meal_planner_weekly: `${prefix}meal_planner_weekly/code.html`,
    notifications: `${prefix}notifications/code.html`,
    user_profile: `${prefix}user_profile/code.html`,
    help_support: `${prefix}help_support/code.html`
  };

  const normalize = (value = '') => value.replace(/\s+/g, ' ').trim().toLowerCase();
  const labelOf = (element) => normalize(element?.textContent || '');
  const urlFor = (target) => routes[target] || target;

  const navigate = (target, { external = false, replace = false } = {}) => {
    const url = urlFor(target);
    if (!url) return;

    if (external) {
      window.open(url, '_blank', 'noopener');
      return;
    }

    if (replace) {
      window.location.replace(url);
    } else {
      window.location.assign(url);
    }
  };

  const wire = (element, target, options = {}) => {
    if (!element) return;

    const url = urlFor(target);
    if (!url) return;

    if (element.tagName === 'A') {
      element.setAttribute('href', url);
    }

    element.style.cursor = 'pointer';

    if (element.dataset.navBound === 'true') {
      return;
    }

    element.dataset.navBound = 'true';
    element.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigate(target, options);
    });
  };

  const firstButton = (matcher) =>
    Array.from(document.querySelectorAll('button')).find((button) => matcher(labelOf(button)));

  const firstLink = (matcher) =>
    Array.from(document.querySelectorAll('a')).find((link) => matcher(labelOf(link)));

  const firstIconTarget = (iconName) => {
    const icon = Array.from(document.querySelectorAll('.material-symbols-outlined')).find(
      (node) => normalize(node.textContent) === normalize(iconName)
    );

    return icon?.closest('button, a, [data-icon], div') || null;
  };

  const firstTextBlock = (matcher) =>
    Array.from(document.querySelectorAll('p, span, h1, h2, h3')).find((node) => matcher(labelOf(node)));

  [
    { match: /^home$/, target: 'home_discovery' },
    { match: /^planner$/, target: 'meal_planner_weekly' },
    { match: /^orders?$/, target: 'order_tracking' },
    { match: /^profile$/, target: 'user_profile' },
    { match: /^(alerts|notifications)$/, target: 'notifications' },
    { match: /^support$/, target: 'help_support' },
    { match: /^saved$/, target: 'menu_listing' },
    { match: /^rewards$/, target: 'meal_planner_weekly' }
  ].forEach(({ match, target }) => {
    document.querySelectorAll('a, button').forEach((element) => {
      if (match.test(labelOf(element))) {
        wire(element, target);
      }
    });
  });

  const protectedPages = new Set([
    'home_discovery', 'menu_listing', 'item_details', 'cart_checkout',
    'payment_gateway', 'order_tracking', 'meal_planner_weekly',
    'notifications', 'user_profile'
  ]);

  const getUser = async () => {
    if (!window.sheAteAuth) return null;
    const { data, error } = await window.sheAteAuth.getSession();
    if (error) return null;
    return data.session?.user || null;
  };

  const isVerified = (user) => Boolean(user?.email_confirmed_at || user?.confirmed_at);
  const user = await getUser();

  if (protectedPages.has(currentPage) && !isVerified(user)) {
    navigate('auth_login', { replace: true });
    return;
  }

  switch (currentPage) {
    case 'index':
      wire(document.getElementById('open-splash'), 'splash_screen');
      navigate('auth_sign_up', { replace: true });
      break;

    case 'splash_screen':
      navigate('auth_sign_up', { replace: true });
      break;

    case 'onboarding_1':
      wire(document.getElementById('next-button'), 'onboarding_2');
      wire(firstButton((label) => label === 'skip'), 'auth_login');
      break;

    case 'onboarding_2':
      wire(firstButton((label) => label === 'skip'), 'auth_login');
      wire(firstButton((label) => label.includes('next')), 'auth_sign_up');
      break;

    case 'auth_login': {
      const loginForm = document.querySelector('form');
      if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const message = document.getElementById('auth-message');
          const submit = loginForm.querySelector('[type="submit"]');
          if (!window.sheAteAuth) {
            if (message) message.textContent = 'Authentication is not configured yet.';
            return;
          }
          submit.disabled = true;
          const { error } = await window.sheAteAuth.signInWithPassword({
            email: loginForm.email.value.trim(), password: loginForm.password.value
          });
          if (error) {
            if (message) message.textContent = error.message;
            submit.disabled = false;
            return;
          }
          const signedInUser = await getUser();
          navigate(isVerified(signedInUser) ? 'home_discovery' : 'auth_verify', { replace: true });
        });
      }
      wire(firstLink((label) => label.includes('create an account')), 'auth_sign_up');
      wire(firstLink((label) => label.includes('forgot password')), 'help_support');
      break;
    }

    case 'auth_sign_up': {
      const signUpForm = document.querySelector('form');
      if (signUpForm) {
        signUpForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const message = document.getElementById('auth-message');
          const submit = signUpForm.querySelector('[type="submit"]');
          if (!window.sheAteAuth) {
            if (message) message.textContent = 'Authentication is not configured yet.';
            return;
          }
          if (signUpForm.password.value !== signUpForm.password_confirm.value) {
            if (message) message.textContent = 'Passwords do not match.';
            return;
          }
          submit.disabled = true;
          const { data, error } = await window.sheAteAuth.signUp({
            email: signUpForm.email.value.trim(),
            password: signUpForm.password.value,
            options: { data: { full_name: signUpForm.full_name.value, phone: signUpForm.phone.value } }
          });
          if (error) {
            if (message) message.textContent = error.message;
            submit.disabled = false;
            return;
          }
          sessionStorage.setItem('sheAteVerificationEmail', signUpForm.email.value.trim());
          navigate(data.session ? 'home_discovery' : 'auth_verify', { replace: true });
        });
      }
      wire(firstLink((label) => label === 'log in' || label === 'sign in'), 'auth_login');
      wire(firstIconTarget('arrow_back'), 'auth_login');
      break;
    }

    case 'auth_verify': {
      const email = sessionStorage.getItem('sheAteVerificationEmail') || user?.email || '';
      const emailTarget = document.getElementById('verification-email');
      if (emailTarget) emailTarget.textContent = email;
      const verifyForm = document.querySelector('form');
      verifyForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = document.getElementById('auth-message');
        const { error } = await window.sheAteAuth.verifyOtp({
          email, token: verifyForm.token.value.trim(), type: 'email'
        });
        if (error) {
          if (message) message.textContent = error.message;
          return;
        }
        sessionStorage.removeItem('sheAteVerificationEmail');
        navigate('home_discovery', { replace: true });
      });
      document.getElementById('resend-otp')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        const message = document.getElementById('auth-message');
        button.disabled = true;
        const { error } = await window.sheAteAuth.signInWithOtp({ email });
        if (message) message.textContent = error ? error.message : 'A new verification code is on its way.';
        let remaining = 60;
        button.textContent = `Resend code (${remaining}s)`;
        const timer = setInterval(() => {
          remaining -= 1;
          button.textContent = remaining ? `Resend code (${remaining}s)` : 'Resend code';
          if (!remaining) { clearInterval(timer); button.disabled = false; }
        }, 1000);
      });
      break;
    }

    case 'menu_listing': {
      wire(firstButton((label) => label.includes('view all')), 'item_details');
      document.querySelectorAll('main .group.relative').forEach((card) => wire(card, 'item_details'));

      Array.from(document.querySelectorAll('button')).forEach((button) => {
        const icon = button.querySelector('.material-symbols-outlined');
        if (normalize(icon?.textContent || '') === 'add') {
          wire(button, 'cart_checkout');
        }
      });

      wire(document.querySelector('header img')?.closest('div'), 'user_profile');
      wire(firstIconTarget('shopping_cart'), 'cart_checkout');
      wire(document.querySelector('header .material-symbols-outlined')?.closest('div'), 'home_discovery');
      break;
    }

    case 'item_details':
      wire(firstIconTarget('arrow_back'), 'menu_listing');
      wire(firstButton((label) => label.includes('add to cart')), 'cart_checkout');
      break;

    case 'cart_checkout':
      wire(firstIconTarget('arrow_back'), 'menu_listing');
      wire(firstButton((label) => label === 'clear'), 'menu_listing');
      wire(firstButton((label) => label.includes('proceed to payment')), 'payment_gateway');
      break;

    case 'payment_gateway':
      wire(firstIconTarget('arrow_back'), 'cart_checkout');
      wire(firstButton((label) => label.includes('pay now')), 'order_tracking');
      break;

    case 'order_tracking':
      wire(firstIconTarget('arrow_back'), 'home_discovery');
      wire(firstButton((label) => label.includes('help')), 'help_support');
      break;

    case 'notifications': {
      wire(firstIconTarget('arrow_back'), 'home_discovery');
      wire(firstButton((label) => label.includes('review plan')), 'meal_planner_weekly');
      wire(firstLink((label) => label === 'orders'), 'order_tracking');
      wire(firstLink((label) => label === 'specials'), 'menu_listing');

      const orderCard = firstTextBlock((label) => label.includes('your order is on the way'))?.closest('[class*="gap-4"]');
      const specialCard = firstTextBlock((label) => label.includes('new friday special'))?.closest('[class*="gap-4"]');
      const plannerCard = firstTextBlock((label) => label.includes('meal plan updated'))?.closest('[class*="gap-4"]');

      wire(orderCard, 'order_tracking');
      wire(specialCard, 'menu_listing');
      wire(plannerCard, 'meal_planner_weekly');
      break;
    }

    case 'help_support': {
      wire(firstIconTarget('arrow_back'), 'user_profile');
      const whatsappButton = firstButton((label) => label.includes('whatsapp'));
      if (whatsappButton) {
        whatsappButton.style.cursor = 'pointer';
        whatsappButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          navigate('https://wa.me/27823276367', { external: true });
        });
      }
      break;
    }

    case 'meal_planner_weekly':
      wire(firstIconTarget('arrow_back'), 'home_discovery');
      document.querySelectorAll('button').forEach((button) => {
        const label = labelOf(button);
        if (label === 'view recipe') wire(button, 'item_details');
        if (label.includes('upgrade my plan')) wire(button, 'payment_gateway');
        if (label.includes('cancel subscription')) wire(button, 'help_support');
      });
      break;

    case 'user_profile': {
      wire(firstIconTarget('arrow_back'), 'home_discovery');
      wire(firstButton((label) => label === 'manage'), 'meal_planner_weekly');
      const links = Array.from(document.querySelectorAll('a')).filter((link) => !link.closest('nav'));
      wire(links[0], 'order_tracking');
      wire(links[1], 'home_discovery');
      wire(links[2], 'payment_gateway');
      wire(links[3], 'notifications');
      wire(firstButton((label) => label.includes('log out')), 'auth_login');
      break;
    }

    default:
      break;
  }
});