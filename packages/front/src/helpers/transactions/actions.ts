import { TransactionPayload } from ".";

export interface Actionable {
  error: string;
  success: string;
  check: ({ transaction: { actions } }: TransactionPayload) => boolean;
}

export const actions = [
  {
    error: "We were unable to claim this clue.",
    success: "Successfully claim your clue.",
    check: ({ transaction: { tActions } }: TransactionPayload) => {
      const [action] = tActions;

      const args = window.atob(action.FunctionCall.args);

      return action.FunctionCall.method_name === "ft_transfer_call" && args.includes('Claim');
    },
  },
  {
    error: "We were unable to stake this clue.",
    success: "Successfully stake your clue.",
    check: ({ transaction: { tActions } }: TransactionPayload) => {
      const [action] = tActions;

      const args = window.atob(action.FunctionCall.args);

      return action.FunctionCall.method_name === "nft_transfer_call" && args.includes('Stake');
    },
  },
];

export default actions;
