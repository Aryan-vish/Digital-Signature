export const sendPasswordResetEmail = async ({ email }) => {
  // Plug in SendGrid, Resend, or another provider here for production resets.
  console.log(`Password reset requested for ${email}`);
};
