import { ReactNode, DetailedHTMLProps, SVGProps, HTMLAttributes } from "react";

type AnyComponent<P extends object = any> = React.ComponentType<P>;

type Taggable = (
  strings: TemplateStringsArray,
  ...n: ((props: any) => string)[]
) => (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> &
    SVGProps<SVGGElement> &
    Record<string, any>,
) => ReactNode;

interface Tags {
  (tag: AnyComponent): Taggable;
  [tag: string]: Taggable;
}

const proxy = (Tag: AnyComponent | string) => {
  return (strings: TemplateStringsArray, ...n: ((props: any) => string)[]) => {
    return (props: any) => {
      let classes = "";
      for (let i = 0; i < strings.length; i++) {
        classes += strings[i];
        if (n[i]) {
          if (typeof n[i] === "function") {
            classes += n[i](props);
          }
        }
      }

      return (
        <Tag {...props} className={`${props.className} ${classes}`}>
          {props.children}
        </Tag>
      );
    };
  };
};

const tailplug = new Proxy(proxy as Tags, {
  get(_, name) {
    const Tag = name as keyof JSX.IntrinsicElements;
    return proxy(Tag);
  },
});

export default tailplug;
