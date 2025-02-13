import { Component } from "react";
import Data from "./Data.jsx";

export default class Category extends Component {
  constructor() {
    super();
    this.state = {
      productList: Data,
    };
  }

  render() {
    return (
      <>
        <table width="100%" border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {this.state.productList.map((product, index) => (
              <tr key={index}>
                <td>{product.title}</td>
                <td>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    width="100px"
                    height="100px"
                  />
                </td>
                <td>{product.price}</td>
                <td>
                  <button onClick={() => this.handleRemove(index)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h1>this is title</h1>
      </>
    );
  }
}
