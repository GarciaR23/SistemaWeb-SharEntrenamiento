export interface Ubigeo {
  ubigeo: string;
  id: number;
  inei?: string;
}

export interface DistrictMap {
  [districtName: string]: Ubigeo;
}

export interface ProvinceMap {
  [provinceName: string]: DistrictMap;
}

export interface DepartmentMap {
  [departmentName: string]: ProvinceMap;
}
