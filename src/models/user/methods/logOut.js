async function logOut(input) {
  let success = false,
    error = 'No user could be found with the provided token';
  const { token } = input;
  if (token) {
    const [updatedUserCount] = await this.update(
      {
        token: null,
        tokenExpirationDate: null
      },
      {
        where: { token }
      }
    );

    if (updatedUserCount > 0) {
      error = null;
      success = true;
    }

    return { success, error };
  }

  return { success: false, error: 'A token was not provided.' };
}

export default logOut;
