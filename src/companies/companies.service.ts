import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Company } from '../companies/company.entity';
import { CreateCompanyDto } from './dtos/create.company.dto';
import { UpdateCompanyDto } from './dtos/update.company.dto';
@Injectable()
export class CompanyService{
constructor(

@InjectRepository(Contact) 
private readonly contactRepository: Repository<Contact>,

@InjectRepository(Company)
private readonly  companyRepository: Repository<Company>,){}
async create(companyData: CreateCompanyDto): Promise<Company> {
const cleanname=companyData.name.trim();
const existedcompany=await  this.companyRepository.findOne({where:{ name: ILike(cleanname),}})
if(existedcompany){
     throw new ConflictException('company exist'); 
}

const newcompany= this.companyRepository.create(
{
...companyData}


)

return (await this.companyRepository.save(newcompany)) as unknown as Company;


}
async update(id: string, updateData: UpdateCompanyDto): Promise<Company> {
  const company = await this.companyRepository.findOne({
    where: { id },
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  Object.assign(company, updateData);

  return await this.companyRepository.save(company);
}

async delete (id: string): Promise<void> {
  const result = await this.companyRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException('Company not found');
  }
}

async get(id: string): Promise<Company> {
  const company = await this.companyRepository.findOne({
    where: { id: id },
    relations: ['contacts', 'deals'], 
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  return company;
}

}