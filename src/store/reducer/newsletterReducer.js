import { createNewsletterSubscriber } from "../factories";

export const reduceNewsletterActions = (state, action) => {
  switch (action.type) {
    case "SUBSCRIBE_TO_NEWSLETTER": {
      const normalizedEmail = action.payload.email.trim().toLowerCase();

      if (
        !normalizedEmail ||
        state.newsletterSubscribers.some(
          (subscriber) => subscriber.email === normalizedEmail,
        )
      ) {
        return state;
      }

      return {
        ...state,
        newsletterSubscribers: [
          ...state.newsletterSubscribers,
          createNewsletterSubscriber({ email: normalizedEmail }),
        ],
      };
    }

    default:
      return state;
  }
};
