import { PrismaClient } from '@prisma/client';

type MyPoint = {
  latitude: number;
  longitude: number;
};

type MyLocation = {
  id: string;
  address: string;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  country: string;
  coordinates: MyPoint;
  userId: string;
  // createdAt: Date;
  // updatedAt: Date;
  // createdBy?: string | null;
  // updatedBy?: string | null;
  // isDeleted: Boolean;
};

const prisma = new PrismaClient().$extends({
  model: {
    location: {
      async create(data: {
        id: string;
        latitude: number;
        longitude: number;
        address: string;
        country: string;
        city: string;
        state?: string;
        zipCode?: string;
        userId: string;
      }) {
        const poi: MyLocation = {
          id: data.id,
          address: data.address,
          country: data.country,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          userId: data.userId,
        };

        // Insert the object into the database
        const point = `POINT(${poi.coordinates.longitude} ${poi.coordinates.latitude})`;

        await prisma.$queryRaw`
            INSERT INTO "locations" (id, coordinates, country, address, city, state, zip_code, user_id, updated_at) VALUES (${poi.id}, ST_GeomFromText(${point}, 4326), ${poi.country}, ${poi.address}, ${poi.city}, ${poi.state}, ${poi.zipCode}, ${poi.userId} ,CURRENT_TIMESTAMP);
          `;

        // Return the object
        return poi;
      },

      async findClosestPoints(latitude: number, longitude: number) {
        // Query for clostest points of interests
        const result = await prisma.$queryRaw<
          {
            id: string;
            st_x: number;
            st_y: number;
            address: string;
            country: string;
            city: string;
            state: string | null;
            zipCode: string | null;
            userId: string;
          }[]
        >`SELECT id, ST_X(coordinates::geometry), ST_Y(coordinates::geometry), country, city, state, zip_code 
            FROM "locations" 
            ORDER BY ST_DistanceSphere(coordinates::geometry, ST_MakePoint(${longitude}, ${latitude})) DESC`;

        // Transform to our custom type
        const pois: MyLocation[] = result.map((data) => {
          return {
            coordinates: {
              latitude: data.st_x,
              longitude: data.st_y,
            },
            address: data.address,
            country: data.country,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            id: data.id,
            userId: data.userId,
          };
        });

        // Return data
        return pois;
      },
    },
  },
});

export default prisma;
