(() => {
  'use strict';

  const loginForm = document.querySelector('#loginForm');
  const loginView = document.querySelector('#loginView');
  const dashboardView = document.querySelector('#dashboardView');
  const recoveryView = document.querySelector('#recoveryView');
  const status = document.querySelector('#status');
  const recoveryStatus = document.querySelector('#recoveryStatus');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const submitButton = loginForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.querySelector('span');
  const supabase = window.inikoreSupabase;

  document.querySelector('#year').textContent = new Date().getFullYear();

  function showLogin(message = '') {
    dashboardView.hidden = true;
    recoveryView.hidden = true;
    loginView.hidden = false;
    status.textContent = message;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showDashboard(user) {
    document.querySelector('#accountEmail').textContent = user.email || 'Administrator';
    loginView.hidden = true;
    recoveryView.hidden = true;
    dashboardView.hidden = false;
    status.textContent = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setSubmitting(isSubmitting) {
    submitButton.disabled = isSubmitting;
    submitButton.setAttribute('aria-busy', String(isSubmitting));
    submitLabel.textContent = isSubmitting ? 'Signing in…' : 'Sign in securely';
  }

  async function requireAdministrator() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      await supabase.auth.signOut();
      showLogin('Your session could not be verified. Please sign in again.');
      return;
    }

    if (data.user.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      showLogin('This account does not have administrator access.');
      return;
    }

    showDashboard(data.user);
  }

  document.querySelector('#togglePassword').addEventListener('click', event => {
    const showing = passwordInput.type === 'password';
    passwordInput.type = showing ? 'text' : 'password';
    event.currentTarget.textContent = showing ? 'Hide' : 'Show';
    event.currentTarget.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
    event.currentTarget.setAttribute('aria-pressed', String(showing));
  });

  document.querySelector('#forgotButton').addEventListener('click', async () => {
    if (!supabase) {
      status.textContent = 'Authentication is not configured. Check the Supabase client setup.';
      return;
    }

    const email = emailInput.value.trim();
    if (!email || !emailInput.validity.valid) {
      status.textContent = 'Enter your account email first, then choose “Forgot password?” again.';
      emailInput.focus();
      return;
    }

    const recoveryUrl = `${window.location.origin}${window.location.pathname}?mode=recovery`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: recoveryUrl
    });

    status.textContent = error
      ? 'We could not send a reset email. Check your connection and try again.'
      : 'If an account exists for that email, a password reset link has been sent.';
  });

  document.querySelector('#recoveryForm').addEventListener('submit', async event => {
    event.preventDefault();

    const newPassword = document.querySelector('#newPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    if (newPassword.length < 8) {
      recoveryStatus.textContent = 'Use a password with at least 8 characters.';
      return;
    }

    if (newPassword !== confirmPassword) {
      recoveryStatus.textContent = 'The passwords do not match.';
      return;
    }

    recoveryStatus.textContent = 'Updating your password…';
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      recoveryStatus.textContent = 'We could not update your password. Request a fresh reset link and try again.';
      return;
    }

    await supabase.auth.signOut();
    document.querySelector('#recoveryForm').reset();
    showLogin('Your password has been updated. Sign in with the new password.');
    window.history.replaceState({}, document.title, window.location.pathname);
  });

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';

    if (!emailInput.validity.valid || !passwordInput.value) {
      status.textContent = 'Enter a valid email address and password.';
      (!emailInput.validity.valid ? emailInput : passwordInput).focus();
      return;
    }

    if (!supabase) {
      status.textContent = 'Authentication is not configured. Check the Supabase client setup.';
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });

    setSubmitting(false);

    if (error) {
      status.textContent = 'Sign-in failed. Check your email and password, then try again.';
      return;
    }

    await requireAdministrator();
  });

  document.querySelector('#signOut').addEventListener('click', async () => {
    if (!supabase) {
      showLogin();
      return;
    }

    const { error } = await supabase.auth.signOut();

    loginForm.reset();
    passwordInput.type = 'password';
    document.querySelector('#togglePassword').textContent = 'Show';
    document.querySelector('#togglePassword').setAttribute('aria-pressed', 'false');
    document.querySelector('#togglePassword').setAttribute('aria-label', 'Show password');

    showLogin(
      error
        ? 'You were signed out here, but the remote session may still be active.'
        : ''
    );
  });

  if (!supabase?.auth) {
    showLogin('Authentication is unavailable. Check the Supabase client setup.');
    submitButton.disabled = true;
    document.querySelector('#forgotButton').disabled = true;
    return;
  }

  const recoveryMode =
    new URLSearchParams(window.location.search).get('mode') === 'recovery';

  if (recoveryMode) {
    loginView.hidden = true;
    dashboardView.hidden = true;
    recoveryView.hidden = false;
  } else {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        showLogin('Unable to check your session. Please sign in again.');
      } else if (data.session) {
        requireAdministrator();
      }
    });
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      loginView.hidden = true;
      dashboardView.hidden = true;
      recoveryView.hidden = false;
      recoveryStatus.textContent = '';
    } else if (event === 'SIGNED_OUT' || !session) {
      showLogin();
    }
  });
})();