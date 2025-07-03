
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  estimatedPrice: number;
  actualPrice?: number;
  category: string;
  addedBy: string;
  purchased: boolean;
  purchasedBy?: string;
}

export interface HouseholdMember {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  members: HouseholdMember[];
  createdAt: Date;
  totalEstimated: number;
  totalActual: number;
}

export interface CostSplit {
  memberId: string;
  memberName: string;
  amount: number;
  items: string[];
}
