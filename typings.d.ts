type ThemeStore = {
  theme: string;
  setTheme: (name: string) => void;
};
type DealersOwnersStore = {
  info: dealersInfo;
  setinfo: (d: dealersInfo) => void;
};
type AdminStore = {
  info: AdminInfo;
  setinfo: (d: AdminInfo) => void;
};
type AdminInfo = {
  name: string;
  email: string;
  uid: string;
};
type dealersInfo = {
  name: string;
  contactDetails: string;
  vehicles: Array<VehicleItem>;
  email: string;
  uid: string;
  interests?: Array<String>;
  notificationPreferences?: {
    liveStream: boolean;
    newContent: boolean;
    recommendations: boolean;
    specialOffers: boolean;
  };
};

type vendorsInfo = {
  name: string;
  contactDetails: string;
  email: string;
  uid: string;
};

type VendorStoreinfo = {
  info: vendorsInfo;
  setinfo: (d: vendorsInfo) => void;
};
type vehicleStore = {
  vehicle: VehicleItem;
  setVehicle: (v: VehicleItem, isEditing?: boolean) => void;
  resetVehicle: () => void;
  addVehicleToDb: (v: VehicleItem) => Promise<void>;
};

type VehicleItem = {
  name: string;
  model: string;
  registration: string;
  images: Array<string | File | Blob>;
  editing?: boolean;
  id?: string;
};

type dentDescription = {
  id: number;
  x: number;
  y: number;
  reference: { image: string | null; description: string };
};
type vehicle = {
  id: string;
  name: string;
  registration: string;
  model: string;
};

interface Blog {
  id: string;
  authorName: string;
  authorEmail: string;
  authorId: string;
  createdAt?: string;
  content: string;
}

type BlogStore = {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  getBlogById: (id: string) => Blog | undefined;
  fetchBlogs: () => Promise<void>;
  lastFetched: any;
};

interface Product {
  id: string;
  productName: string;
  productEmail: string;
  productId: string;
  createdAt?: string;
  content?: string;
}
type Vendor = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  contactDetails: string;
};
type VendorStore = {
  Vendors: Vendor[];
  setVendors: (Vendor: Vendor[]) => void;
  getVendorId: (id: string) => Vendor | undefined;
  fetchVendor: () => Promise<void>;
  lastFetched: any;
  deleteVendorAccount: (id: string) => void;
};
type Influencer = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  contactDetails: string;
};
type Admin = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};
type InfluencerStore = {
  Influencers: Influencer[];
  setInfluencers: (Influencers: Influencer[]) => void;
  getInfluencerById: (id: string) => Influencer | undefined;
  fetchInfluencers: () => Promise<void>;
  lastFetched: any;
};
type AdminStore = {
  Admin: Admin[];
  setAdmin: (Admin: Admin[]) => void;
  getAdminById: (id: string) => Admin | undefined;
  fetchAdmin: () => Promise<void>;
  lastFetched: any;
};

interface Order {
  id: string;
  email: string;
  created_at: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string;
}
interface Order {
  id: string;
  email: string;
  created_at: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string;
}

interface ProfileState {
  uid: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  twitter: string;
  instagram: string;
  youtube: string;
  category: Array<string>;
  channel?: string;
  estimatedEarnings: number;
  profilePic: any;
  followers?: 0;
  setProfile: (user: {
    uid: string;
    name: string;
    email: string;
    username: string;
    bio: string;
    twitter: string;
    instagram: string;
    youtube: string;
    category: Array<string>;
    channel?: string;
    estimatedEarnings: number;
    profilePic: any;
    followers?: 0;
  }) => void;
}
