import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create.contact.dto'; // تأكدي من المسار صح

export class UpdateContactDto extends PartialType(CreateContactDto) {}