// import { useState } from 'react'
// import { Employee } from '@/domain/entities/Employee'
// import { useEmployeeStore } from '@/infrastructure/stores/employeeStore'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/presentation/components/ui/dialog'
// import { Button } from '@/presentation/components/ui/button'
// import { Input } from '@/presentation/components/ui/input'
// import { Label } from '@/presentation/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/presentation/components/ui/select'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/presentation/components/ui/card'
// import { format } from 'date-fns'
// import { cn } from '@/presentation/lib/utils'

// export function BenefitsManagementDialog() {
//   const [open, setOpen] = useState(false)
//   const { employees, updateEmployee } = useEmployeeStore()
//   const currentMonth = format(new Date(), 'MMMM yyyy')

//   const handleBenefitUpdate = (employee: Employee, type: 'prime' | 'conges', value: number) => {
//     updateEmployee({
//       ...employee,
//       benefits: {
//         ...employee.benefits,
//         [type]: value,
//         [`last${type.charAt(0).toUpperCase() + type.slice(1)}Date`]: new Date().toISOString()
//       }
//     })
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="ml-2">
//           Monthly Benefits
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Monthly Benefits Management - {currentMonth}</DialogTitle>
//         </DialogHeader>

//         <div className="grid gap-4">
//           {employees.map((employee) => (
//             <Card key={employee.id} className="relative overflow-hidden">
//               {employee.type === 'declared' && (
//                 <div className="absolute top-0 right-0 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-bl">
//                   Declared
//                 </div>
//               )}
//               <CardHeader>
//                 <CardTitle>{employee.name}</CardTitle>
//                 <CardDescription>{employee.position}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-6">
//                   {/* Prime Section */}
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <Label>Prime</Label>
//                       <div className="text-sm text-muted-foreground">
//                         Last:{' '}
//                         {employee.benefits.lastPrimeDate
//                           ? format(new Date(employee.benefits.lastPrimeDate), 'PP')
//                           : 'Never'}
//                       </div>
//                     </div>
//                     <div className="flex space-x-2">
//                       <Input
//                         type="number"
//                         value={employee.benefits.prime || ''}
//                         onChange={(e) =>
//                           handleBenefitUpdate(employee, 'prime', parseFloat(e.target.value))
//                         }
//                         className="w-32"
//                         placeholder="Amount"
//                       />
//                       <Select
//                         value={employee.benefits.primeType}
//                         onValueChange={(value: any) =>
//                           updateEmployee({
//                             ...employee,
//                             benefits: { ...employee.benefits, primeType: value }
//                           })
//                         }
//                       >
//                         <SelectTrigger className="w-[180px]">
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="performance">Performance</SelectItem>
//                           <SelectItem value="attendance">Présence</SelectItem>
//                           <SelectItem value="other">Autre</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   {/* Congés Section */}
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <Label>Congés</Label>
//                       <div className="text-sm text-muted-foreground">
//                         Last:{' '}
//                         {employee.benefits.lastCongesDate
//                           ? format(new Date(employee.benefits.lastCongesDate), 'PP')
//                           : 'Never'}
//                       </div>
//                     </div>
//                     <div className="flex space-x-2 items-end">
//                       <div className="space-y-2">
//                         <Input
//                           type="number"
//                           value={employee.benefits.conges || ''}
//                           onChange={(e) =>
//                             handleBenefitUpdate(employee, 'conges', parseFloat(e.target.value))
//                           }
//                           className="w-32"
//                           placeholder="Days"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Input
//                           type="number"
//                           value={employee.benefits.congesRate || ''}
//                           onChange={(e) =>
//                             updateEmployee({
//                               ...employee,
//                               benefits: {
//                                 ...employee.benefits,
//                                 congesRate: parseFloat(e.target.value)
//                               }
//                             })
//                           }
//                           className="w-32"
//                           placeholder="Daily Rate"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-4 border-t">
//                   <div className="flex justify-between text-sm">
//                     <span>Total Benefits Value:</span>
//                     <span className="font-medium">
//                       €
//                       {(
//                         employee.benefits.prime +
//                         employee.benefits.conges * employee.benefits.congesRate
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
