import Test from "../Test";
import { renderWithProviders } from "./mocks/renderWithProviders";
import { screen } from "@testing-library/react";

describe('<test/>', () => {
  it('renders the test component', ()=>{
    const sampleProps = 'testing'
    renderWithProviders(<Test data={sampleProps}/>);

    const data = screen.queryByText(`${sampleProps} for test component`)

    //use this and check terminal for a link to playground to check what the dom structure looks like
    // screen.logTestingPlaygroundURL();

    expect(data).toBeInTheDocument()
  })
})