const Item = ({ item, onRemoveItem }) => (
  <tr>
    <td>
      <a href={item.url}>{item.title}</a>
    </td>
    <td>{item.author}</td>
    <td>{item.points}</td>
    <td>{item.num_comments}</td>
    <td>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </td>
  </tr>
);

export const List = ({ list, onRemoveItem, sortValue, reverse }) => {
  const headings = ["Title", "Author", "Points", "Num of comments", "Actions"];

  const sortHandler = (arrayOfList, sortval) => {
    const newList = [...arrayOfList];

    if (sortval) {
      newList.sort((a, b) => {
        const [firstValue, secondValue] = [a[sortval], b[sortval]];
        if (typeof firstValue === "string") {
          return firstValue.localeCompare(secondValue);
        } else {
          return firstValue - secondValue;
        }
      });
    }
    return reverse
      ? newList
          .reverse()
          .map((item) => (
            <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
          ))
      : newList.map((item) => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ));
  };

  return (
    <table>
      <thead>
        <tr>
          {headings.map((each, i) => (
            <th key={i}>{each}</th>
          ))}
        </tr>
      </thead>
      <tbody>{sortHandler(list, sortValue)}</tbody>
    </table>
  );
};
