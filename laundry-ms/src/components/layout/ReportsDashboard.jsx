import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, Filter, BarChart2, PieChart, Table as TableIcon, DollarSign, Package, Users, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Sample data for reports
const generateSalesData = (days = 7) => {
  const services = ['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Stain Removal'];
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), days - 1 - i);
    services.forEach(service => {
      data.push({
        id: `${i}-${service}`,
        date: format(date, 'MMM dd, yyyy'),
        service,
        amount: Math.floor(Math.random() * 500) + 100,
        orders: Math.floor(Math.random() * 20) + 5
      });
    });
  }
  
  return data;
};

const generateInventoryData = () => {
  return [
    { id: 1, item: 'Detergent (L)', current: 45, threshold: 20, lastOrdered: '2025-11-10' },
    { id: 2, item: 'Fabric Softener (L)', current: 32, threshold: 15, lastOrdered: '2025-11-12' },
    { id: 3, item: 'Bleach (L)', current: 18, threshold: 10, lastOrdered: '2025-11-14' },
    { id: 4, item: 'Stain Remover (bottles)', current: 22, threshold: 5, lastOrdered: '2025-11-15' },
    { id: 5, item: 'Plastic Bags (pack of 100)', current: 8, threshold: 3, lastOrdered: '2025-11-13' },
  ];
};

const generateTransactionData = () => {
  const statuses = ['Completed', 'In Progress', 'Ready for Pickup', 'Pending Payment'];
  const services = ['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Stain Removal'];
  const data = [];
  
  for (let i = 1; i <= 20; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 30));
    const service = services[Math.floor(Math.random() * services.length)];
    const amount = (Math.random() * 200 + 10).toFixed(2);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    data.push({
      id: `TXN-${1000 + i}`,
      date: format(date, 'MMM dd, yyyy HH:mm'),
      customer: `Customer ${i}`,
      service,
      amount: `$${amount}`,
      status,
      payment: Math.random() > 0.3 ? 'Paid' : 'Pending'
    });
  }
  
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const ReportsDashboard = () => {
  const [date, setDate] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const reportTypes = [
    { id: 'sales', label: 'Sales Report', icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { id: 'inventory', label: 'Inventory Report', icon: <PieChart className="h-4 w-4 mr-2" /> },
    { id: 'transactions', label: 'Transaction Logs', icon: <TableIcon className="h-4 w-4 mr-2" /> },
  ];

  // Generate sample data
  const salesData = useMemo(() => generateSalesData(7), []);
  const inventoryData = useMemo(() => generateInventoryData(), []);
  const transactionData = useMemo(() => generateTransactionData(), []);

  // Calculate summary metrics
  const summaryData = useMemo(() => ({
    totalSales: salesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2),
    totalOrders: salesData.reduce((sum, item) => sum + item.orders, 0),
    lowStockItems: inventoryData.filter(item => item.current <= item.threshold).length,
    pendingPayments: transactionData.filter(tx => tx.payment === 'Pending').length,
  }), [salesData, inventoryData, transactionData]);

  // Chart data for sales
  const salesChartData = {
    labels: [...new Set(salesData.map(item => item.date))],
    datasets: [
      {
        label: 'Wash & Fold',
        data: salesData.filter(item => item.service === 'Wash & Fold').map(item => item.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Dry Cleaning',
        data: salesData.filter(item => item.service === 'Dry Cleaning').map(item => item.amount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Ironing',
        data: salesData.filter(item => item.service === 'Ironing').map(item => item.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Stain Removal',
        data: salesData.filter(item => item.service === 'Stain Removal').map(item => item.amount),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  };

  // Chart data for inventory
  const inventoryChartData = {
    labels: inventoryData.map(item => item.item),
    datasets: [
      {
        data: inventoryData.map(item => item.current),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const generateReport = (type) => {
    console.log(`Generating ${type} report for`, date);
    // In a real app, this would trigger a download or API call
    alert(`${type} report generation started for ${format(date.from, 'MMM dd, yyyy')} to ${format(date.to, 'MMM dd, yyyy')}`);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Completed': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Ready for Pickup': 'bg-purple-100 text-purple-800',
      'Pending Payment': 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Reports Dashboard</h1>
          <p className="text-muted-foreground">
            {date?.from && date?.to
              ? `Showing data from ${format(date.from, 'MMM dd, yyyy')} to ${format(date.to, 'MMM dd, yyyy')}`
              : 'Select a date range to view data'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summaryData.totalSales}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+12% from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items below threshold</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detailed Reports</h2>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[300px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'MMM dd, yyyy')} -{' '}
                        {format(date.to, 'MMM dd, yyyy')}
                      </>
                    ) : (
                      format(date.from, 'MMM dd, yyyy')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {reportTypes.map((report) => (
              <TabsTrigger key={report.id} value={report.id}>
                {report.icon}
                {report.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Sales Report Tab */}
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Daily sales performance by service type</CardDescription>
                  </div>
                  <Button onClick={() => generateReport('sales')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar 
                    data={salesChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true,
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value;
                            }
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return context.dataset.label + ': $' + context.raw;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Daily Sales Breakdown</h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead className="text-right">Orders</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesData.slice(0, 5).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.date}</TableCell>
                            <TableCell>{item.service}</TableCell>
                            <TableCell className="text-right">{item.orders}</TableCell>
                            <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Report Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Current stock levels and alerts</CardDescription>
                  </div>
                  <Button onClick={() => generateReport('inventory')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-80">
                    <Pie 
                      data={inventoryChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} units (${percentage}%)`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Stock Levels</h3>
                    <div className="space-y-4">
                      {inventoryData.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{item.item}</h4>
                            <span className={`text-sm font-medium ${item.current <= item.threshold ? 'text-red-500' : 'text-green-500'}`}>
                              {item.current} / {item.threshold * 2} units
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${item.current <= item.threshold ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(100, (item.current / (item.threshold * 2)) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Last ordered: {item.lastOrdered}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction Logs Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction Logs</CardTitle>
                    <CardDescription>Recent laundry service transactions</CardDescription>
                  </div>
                  <Button onClick={() => generateReport('transactions')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionData.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">{tx.id}</TableCell>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell>{tx.customer}</TableCell>
                          <TableCell>{tx.service}</TableCell>
                          <TableCell className="text-right">{tx.amount}</TableCell>
                          <TableCell>
                            <StatusBadge status={tx.status} />
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.payment === 'Paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tx.payment}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">{Math.min(10, transactionData.length)}</span> of{' '}
                    <span className="font-medium">{transactionData.length}</span> transactions
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsDashboard;
