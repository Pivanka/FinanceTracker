import {AbstractControl} from "@angular/forms";

export function ValidateFilesize(control: AbstractControl<string | null>) {

  if (control.value) {
    const size = getOriginalLengthInBytes(control.value);

    if (size >= 2 * 1048576) {
      return {maxSize: true};
    }
  }

  return null;
}

function getOriginalLengthInBytes(base64string: string): number {
  if (!base64string)
    return 0;

  const split = base64string.split(",", 2);

  base64string = split[1];
  const characterCount = base64string.length;
  const paddingCount = [...base64string.substring(characterCount - 2, 2)].filter(c => c == '=').length;
  return 3 * (characterCount / 4) - paddingCount;
}
