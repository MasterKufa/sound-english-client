declare module "*.svg" {
  const content: string;

  const ReactComponent: React.FunctionComponent<
    React.SVGAttributes<SVGElement>
  >;

  export { ReactComponent };

  export default content;
}
