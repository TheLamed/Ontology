import { ApiResponse } from "../models/api-response.model";

export function API<T extends ApiResponse>() {
  return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {

    var originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let output: T = {} as T;
      try {
        let result = await originalMethod.apply(this, args);

        Object.assign(output, result);
        output.success = true;
        output.status = 200;
      }
      catch (e) {
        output.success = false;
        output.error = e;
        output.status = e.status;

        console.log('API ERROR:', e);
        alert(e);

        if (output.status == 401) {
          window.location.href = '/';
        }
      }
      return output;
    };
    return descriptor;
  }
}
