/* Allow Zoho form custom attributes in JSX without changing ids/classes/values */
import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    name?: string;
    changeid?: string;
    changename?: string;
    changetype?: string;
    logo?: string;
  }
  interface InputHTMLAttributes<T> {
    changeitem?: string;
    names?: string;
    multi?: string;
    check?: string;
    zc_display_name?: string;
  }
  interface TextareaHTMLAttributes<T> {
    changeitem?: string;
    zc_display_name?: string;
  }
  interface SelectHTMLAttributes<T> {
    changeitem?: string;
  }
  interface ImgHTMLAttributes<T> {
    align?: string;
  }
}
