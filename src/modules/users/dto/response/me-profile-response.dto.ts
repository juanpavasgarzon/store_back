export class MeProfileResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;

  constructor(data: { id: string; email: string; name: string; role: string }) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
  }
}
