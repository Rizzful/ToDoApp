export type ModalConfig = {
  open: boolean;
  type: "confirm" | "alert";
  title: string;
  description: string;
  options: {
    label: string;
    functions: { (): void }[];
  }[];
  close: () => void;
};
