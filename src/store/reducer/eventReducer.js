export const reduceEventActions = (state, action) => {
  switch (action.type) {
    case "TOGGLE_RSVP": {
      const rsvps = state.rsvps || [];
      const { eventId } = action.payload;

      return {
        ...state,
        rsvps: rsvps.includes(eventId)
          ? rsvps.filter((id) => id !== eventId)
          : [...rsvps, eventId],
      };
    }
    default:
      return state;
  }
};
