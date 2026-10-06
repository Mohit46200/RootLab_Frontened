const HDR = "#include<iostream>\n#include<math.h>\n#include<iomanip>\n";
export const T = {
bisection: (c) => HDR + String.raw`#define bisect(a,b) (a+b)/2
#define err 0.000001
using namespace std;
double f(double x)
{
    return ${c.f};
}
int main()
{
    int i=1,max;
    double x,x1,a,b;
    cout<<"f(x)=${c.eq}\n";
    cout<<"Enter two initial approximate roots a,b : ";
    cin>>a>>b;
    cout<<"Enter max no of iterations: ";
    cin>>max;
    cout<<setprecision(10)<<"Iterations\tRoot\n";
    x=bisect(a,b);
    while(i<max)
    {
        cout<<i<<"\t\t"<<x<<endl;
        if(f(a)*f(x)<0)
            b=x;
        else
            a=x;
        x1=bisect(a,b);
        i++;
        if(fabs(x1-x)<err)
        {
            cout<<"\nRoot after "<<i<<" iterations="<<setprecision(10)<<bisect(a,b)<<endl;
            return 0;
        }
        x=x1;
    }
    cout<<"\nSolution Does not cover: "<<i<<" iteration not sufficient";
    return 1;
}`,
newton: (c) => HDR + String.raw`using namespace std;
double f(double x)
{
    return ${c.f};
}
double df(double x)
{
    return ${c.df};
}
int main()
{
    int itr,maxitr;
    double h,x0,x1,aerr;
    cout<<"f(x)=${c.eq}\n";
    cout<<"Enter x0, allowed error, maximum iterations"<<endl;
    cin>>x0>>aerr>>maxitr;
    cout<<fixed;
    for(itr=1;itr<=maxitr;itr++)
    {
        h=f(x0)/df(x0);
        x1=x0-h;
        cout<<"Iteration no."<<setw(3)<<itr
            <<" X = "<<setw(9)<<setprecision(6)<<x1<<endl;
        if(fabs(h)<aerr)
        {
            cout<<"After"<<setw(3)<<itr
                <<" iterations, root = "
                <<setw(8)<<setprecision(6)<<x1;
            return 0;
        }
        x0=x1;
    }
    cout<<"Iterations not sufficient,"
        <<" solution does not converge"<<endl;
    return 1;
}`,
regula: (c) => HDR + String.raw`#define err 0.0001
using namespace std;
double f(double x)
{
    return ${c.f};
}
double regula(double x0,double x1)
{
    return x0-((x1-x0)/(f(x1)-f(x0))*f(x0));
}
int main()
{
    int i=1,max;
    double x0,x1,x2,x3;
    cout<<"f(x)=${c.eq}\n";
    cout<<"Enter two initial approximate roots x0,x1 : ";
    cin>>x0>>x1;
    cout<<"Enter max No of iterations: ";
    cin>>max;
    cout<<setprecision(6)<<"Iterations\tRoot\n";
    x2=regula(x0,x1);
    while(i<max)
    {
        cout<<i<<"\t\t"<<x2<<endl;
        if(f(x0)*f(x2)<0)
            x1=x2;
        else
            x0=x2;
        x3=regula(x0,x1);
        i++;
        if(fabs(x3-x2)<err)
        {
            cout<<"\nRoot after "<<i<<" iterations="<<setprecision(5)<<regula(x0,x1)<<endl;
            return 0;
        }
        x2=x3;
    }
    cout<<"\nSolution Does not cover: "<<i<<" iteration not sufficient";
    return 1;
}`,
iterative: (c) => HDR + String.raw`#define err 0.0001
using namespace std;
double iterative(double x)
{
    return ${c.g};   // x = g(x)
}
double f(double x)
{
    return ${c.f};
}
int main()
{
    int i=1;
    double x0,x1;
    cout<<"f(x)=${c.eq}\n";
    cout<<"Enter the first approximation ";
    cin>>x0;
    x1=iterative(x0);
    cout<<"Iteration\t\tRoot\n";
    while(fabs(x1-x0)>err && i<100)
    {
        cout<<"X"<<i<<"\t"<<x1<<endl;
        x0=x1;
        x1=iterative(x0);
        i++;
    }
    cout<<"Root after "<<i<<" iteration="<<x1;
    return 0;
}`,
secant: (c) => HDR + String.raw`#define err 0.0001
using namespace std;
double f(double x)
{
    return ${c.f};
}
double secant(double x0,double x1)
{
    return x1-((x1-x0)/(f(x1)-f(x0))*f(x1));
}
int main()
{
    int i=2;
    double x0,x1,x2,x3;
    cout<<"f(x)=${c.eq}\n";
    cout<<"Enter two initial approximate roots x0,x1 : ";
    cin>>x0>>x1;
    cout<<setprecision(6)<<"Iterations\tRoot\n";
    x2=secant(x0,x1);
    while(fabs(x2-x1)>err && i<100)
    {
        cout<<"X"<<i<<"\t\t"<<x2<<endl;
        x3=secant(x1,x2);
        x1=x2;
        x2=x3;
        i++;
    }
    cout<<"\nAfter "<<i-1<<" iterations Root ="<<x2;
    return 0;
}`
};

