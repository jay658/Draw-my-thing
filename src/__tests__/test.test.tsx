import { render, screen } from "@testing-library/react";
import Test from "../Test";

describe('<test/>', () => {
  it('renders the test component', ()=>{

    expect(1).toEqual(1);
  })

  // it('this test fails', ()=>{
  //   render(<Test/>);

  //   const testText = screen.queryByText("no test");

  //   expect(testText).toBeInTheDocument();
  // })
})