import TestComponent from "../Components/TestComponent";
import { renderWithProviders } from "./mocks/renderWithProviders";
import { screen } from "@testing-library/react";

describe('<TestComponent/>', () => {
  it('renders the test component', ()=>{
    const sampleProps = 'testing'
    renderWithProviders(<TestComponent data={sampleProps}/>);

    const data = screen.queryByText(`${sampleProps} for test component`)

    //use this and check terminal for a link to playground to check what the dom structure looks like
    // screen.logTestingPlaygroundURL();

    expect(data).toBeInTheDocument()
  })
})