import { render, screen } from "@testing-library/react";

import Parent from "../Components/Parent";

describe('<Parent/>', ()=>{
  it('renders correctly', ()=>{
    render(<Parent/>)
    const text = screen.queryByText('Parent text')
    expect(text).toBeInTheDocument
    expect(text?.innerHTML).toEqual('Parent text')
    const testtext = screen.queryByLabelText('test')
    expect(testtext?.innerHTML).toEqual('Parent text')
  })
})