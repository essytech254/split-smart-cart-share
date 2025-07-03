
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingItem, HouseholdMember, CostSplit } from "@/types/shopping";

interface CostSplitterProps {
  items: ShoppingItem[];
  members: HouseholdMember[];
}

export default function CostSplitter({ items, members }: CostSplitterProps) {
  const purchasedItems = items.filter(item => item.purchased);
  const totalCost = purchasedItems.reduce((sum, item) => sum + (item.actualPrice || item.estimatedPrice), 0);
  const perPersonCost = members.length > 0 ? totalCost / members.length : 0;

  const memberSpending = members.map(member => {
    const memberItems = purchasedItems.filter(item => item.purchasedBy === member.id);
    const spent = memberItems.reduce((sum, item) => sum + (item.actualPrice || item.estimatedPrice), 0);
    const owes = perPersonCost - spent;
    
    return {
      member,
      spent,
      owes,
      items: memberItems
    };
  });

  const settlements = memberSpending
    .filter(m => Math.abs(m.owes) > 0.01)
    .sort((a, b) => b.owes - a.owes);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                KES {totalCost.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                KES {perPersonCost.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Per Person</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Individual Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {memberSpending.map(({ member, spent, owes, items }) => (
            <div key={member.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: member.color }}
                  />
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Spent: KES {spent.toFixed(2)}
                  </div>
                  <div className={`text-sm font-medium ${owes > 0 ? 'text-red-600' : owes < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {owes > 0.01 ? `Owes KES ${owes.toFixed(2)}` : 
                     owes < -0.01 ? `Owed KES ${Math.abs(owes).toFixed(2)}` : 
                     'Settled'}
                  </div>
                </div>
              </div>
              
              {items.length > 0 && (
                <div className="ml-6 space-y-1">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-xs text-gray-500">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>KES {(item.actualPrice || item.estimatedPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      {settlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settlements Needed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {settlements.map(({ member, owes }) => (
              <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: member.color }}
                  />
                  <span className="text-sm">{member.name}</span>
                </div>
                <Badge variant={owes > 0 ? "destructive" : "default"}>
                  {owes > 0 ? `Owes KES ${owes.toFixed(2)}` : `Owed KES ${Math.abs(owes).toFixed(2)}`}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
