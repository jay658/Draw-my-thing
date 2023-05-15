import { render, screen } from "@testing-library/react";
import Test from "../Test";

describe('<test/>', () => {
  it('renders the test component', ()=>{
    render(<Test/>);

    const testText = screen.queryByText("test");

    expect(testText).toBeInTheDocument();
  })

  // it('this test fails', ()=>{
  //   render(<Test/>);

  //   const testText = screen.queryByText("no test");

  //   expect(testText).toBeInTheDocument();
  // })
})