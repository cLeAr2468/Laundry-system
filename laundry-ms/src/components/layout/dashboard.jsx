import React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import images1 from '../../assets/pics.jpg';
import { Link } from 'react-router-dom';


const Dashboard = () => {
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/laundry-logo.jpg')",
            }}
        >
            <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen'>

                <div className="container mx-auto pt-4 px-4">
                    <Link to="/login">
                        <Button className="bg-[#126280] text-white px-8 text-lg hover:bg-[#126280]/90">
                            Log out
                        </Button>
                    </Link>
                    <div className="md:block hidden mt-10 w-full flex justify-center">
                        <img
                            src={images1}
                            alt="Laundry Shop"
                            className="rounded-lg shadow-lg w-full h-[300px] object-cover"
                        />
                    </div>
                  </CardContent>

                </Card>

                {/* Store Inventory */}
                <Card className="bg-[#688ce4] shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-white">
                      STORE INVENTORY
                    </CardTitle>
                    <Input type="date" className="max-w-[180px] bg-white border-slate-300 text-slate-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-x-6 px-2">
                      {/* Header row */}
                      <div />
                      <div className="text-sm font-semibold text-white tracking-wide">PROCESS</div>
                      <div className="text-sm font-semibold text-white tracking-wide">VOICE</div>

                      {/* GARMENT row */}
                      <div className="text-white">GARMENT</div>
                      <div className="text-white font-semibold">45</div>
                      <div className="text-white font-semibold">2,000</div>

                      {/* ORDER row */}
                      <div className="text-white">ORDER</div>
                      <div className="text-white font-semibold">45</div>
                      <div className="text-white font-semibold">645</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Others Statistic */}
                <Card className="bg-[#688ce4] shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-white">
                      OTHERS STATISTIC
                    </CardTitle>
                    <Input type="date" className="max-w-[180px] bg-white border-slate-300 text-slate-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 text-center gap-y-2">
                      {/* Header row */}
                      <div className="text-sm font-semibold text-white tracking-wide">LAUNDRY</div>
                      <div className="text-sm font-semibold text-white tracking-wide">READY</div>
                      <div className="text-sm font-semibold text-white tracking-wide">PROCESS</div>
                      {/* Values row */}
                      <div className="text-2xl font-bold text-white">15</div>
                      <div className="text-2xl font-bold text-white">10</div>
                      <div className="text-2xl font-bold text-white">5</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Laundry Status Chart */}
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    LAUNDRY STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LaundryStatusChart />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
