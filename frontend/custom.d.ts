import { PropsWithChildren } from "react";

declare module "*.svg" {
  const content: string;
  export default content;
}

// Because of stricter typecheck on newer version of react
declare module "@chakra-ui/react" {
  export interface AvatarFallbackProps extends PropsWithChildren {}
  export interface AvatarImageProps extends PropsWithChildren {
    src: any;
    srcSet: any;
    loading: any;
  }
  export interface DialogContentProps extends PropsWithChildren {
    asChild: any;
  }
  export interface DialogCloseTriggerProps extends PropsWithChildren {
    asChild: any;
    position?: any;
    top?: any;
    insetEnd?: any;
  }
  export interface TooltipTriggerProps extends PropsWithChildren {
    asChild: any;
  }
  export interface CloseTriggerProps {}
}
