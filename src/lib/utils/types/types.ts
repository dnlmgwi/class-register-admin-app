type Meta = {
  total: number;
};

interface PaginatedResult<T> {
  data: {
    value: T[];
    meta: {
      total: number;
    };
  };
}

type Location = {
  latitude: number;
  longitude: number;
};

type AllowedArea = {
  latitude: number;
  longitude: number;
  radius: number;
};

export type { Location, AllowedArea, Meta, PaginatedResult };
