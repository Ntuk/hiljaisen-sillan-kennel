function DogsList({ dogs, onSelectDog }) {
  return (
    <div>
      <h2>Dogs List</h2>
      <ul>
        {dogs.map((dog) => (
          <li key={dog.id} onClick={() => onSelectDog(dog)}>
            {dog.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DogsList;
