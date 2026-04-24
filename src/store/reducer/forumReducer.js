import { createProposal, createProposalComment, nowIso } from "../factories";
import { normalizeProposalAttachments } from "../normalizers";

export const reduceForumActions = (state, action) => {
  switch (action.type) {
    case "UPSERT_PROPOSAL": {
      const existing = state.forum.find(
        (proposal) => proposal.id === action.payload.id,
      );

      if (existing) {
        if (!["draft", "discussion"].includes(existing.status)) return state;

        const timestamp = nowIso();

        return {
          ...state,
          forum: state.forum.map((proposal) =>
            proposal.id === existing.id
              ? {
                  ...proposal,
                  title: action.payload.title ?? proposal.title,
                  description:
                    action.payload.description ?? proposal.description,
                  attachments:
                    action.payload.attachments !== undefined
                      ? normalizeProposalAttachments(action.payload.attachments)
                      : proposal.attachments,
                  updatedAt: timestamp,
                }
              : proposal,
          ),
        };
      }

      const proposal = createProposal({
        title: action.payload.title,
        description: action.payload.description,
        authorId: action.payload.authorId ?? state.session.currentUserId,
        status: "draft",
        votes: {},
        comments: [],
        attachments: normalizeProposalAttachments(action.payload.attachments),
      });

      return {
        ...state,
        forum: [...state.forum, proposal],
      };
    }

    case "PUBLISH_PROPOSAL": {
      const timestamp = nowIso();

      return {
        ...state,
        forum: state.forum.map((proposal) =>
          proposal.id === action.payload.id && proposal.status === "draft"
            ? {
                ...proposal,
                status: "discussion",
                publishedAt: proposal.publishedAt ?? timestamp,
                updatedAt: timestamp,
              }
            : proposal,
        ),
      };
    }

    case "OPEN_VOTING": {
      const timestamp = nowIso();

      return {
        ...state,
        forum: state.forum.map((proposal) =>
          proposal.id === action.payload.id && proposal.status === "discussion"
            ? {
                ...proposal,
                status: "voting",
                votingOpenedAt: proposal.votingOpenedAt ?? timestamp,
                votingDeadline: action.payload.votingDeadline,
                updatedAt: timestamp,
              }
            : proposal,
        ),
      };
    }

    case "CAST_VOTE": {
      const timestamp = nowIso();

      return {
        ...state,
        forum: state.forum.map((proposal) => {
          if (proposal.id !== action.payload.proposalId) return proposal;
          if (proposal.status !== "voting") return proposal;
          if (
            proposal.votingDeadline &&
            new Date(proposal.votingDeadline) <= new Date()
          ) {
            return proposal;
          }

          return {
            ...proposal,
            votes: {
              ...proposal.votes,
              [action.payload.userId]: {
                value: action.payload.voteValue,
                castAt: timestamp,
              },
            },
            updatedAt: timestamp,
          };
        }),
      };
    }

    case "WITHDRAW_PROPOSAL": {
      const timestamp = nowIso();

      return {
        ...state,
        forum: state.forum.map((proposal) =>
          proposal.id === action.payload.id &&
          ["draft", "discussion", "voting"].includes(proposal.status)
            ? {
                ...proposal,
                status: "withdrawn",
                withdrawnAt: proposal.withdrawnAt ?? timestamp,
                updatedAt: timestamp,
              }
            : proposal,
        ),
      };
    }

    case "MARK_IMPLEMENTED": {
      const timestamp = nowIso();

      return {
        ...state,
        forum: state.forum.map((proposal) =>
          proposal.id === action.payload.id && proposal.status === "closed"
            ? {
                ...proposal,
                status: "implemented",
                implementedAt: proposal.implementedAt ?? timestamp,
                implementationNote: action.payload.implementationNote ?? "",
                updatedAt: timestamp,
              }
            : proposal,
        ),
      };
    }

    case "CLOSE_PROPOSAL": {
      const timestamp = nowIso();

      return {
        ...state,
        forum: state.forum.map((proposal) =>
          proposal.id === action.payload.id && proposal.status === "voting"
            ? {
                ...proposal,
                status: "closed",
                closedAt: proposal.closedAt ?? timestamp,
                updatedAt: timestamp,
              }
            : proposal,
        ),
      };
    }

    case "ADD_PROPOSAL_COMMENT": {
      const timestamp = nowIso();

      return {
        ...state,
        forum: state.forum.map((proposal) => {
          if (proposal.id !== action.payload.proposalId) return proposal;
          if (
            !["discussion", "closed", "implemented"].includes(proposal.status)
          ) {
            return proposal;
          }

          return {
            ...proposal,
            comments: [
              ...(proposal.comments ?? []),
              createProposalComment({
                body: action.payload.body,
                authorId: action.payload.authorId,
                at: timestamp,
              }),
            ],
            updatedAt: timestamp,
          };
        }),
      };
    }

    case "REMOVE_PROPOSAL": {
      const nextForum = state.forum.filter(
        (proposal) =>
          proposal.id !== action.payload.id || proposal.status !== "draft",
      );

      return nextForum.length === state.forum.length
        ? state
        : { ...state, forum: nextForum };
    }

    default:
      return state;
  }
};
