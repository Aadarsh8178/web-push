export const userSlice = (set, get) => ({
  user: {},
  setUser: (user) =>
    set((state) => {
      state.user = user;
    }),
});
