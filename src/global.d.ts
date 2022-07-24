interface Validation {
  id: string;
  fn: (arg0: string) => boolean;
  msg: string | ((arg0: string) => string);
}

type ValidationsGenerator = (seed: number) => Array<Validation>;
