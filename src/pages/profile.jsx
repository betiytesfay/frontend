export default function Profile() {
  const [logout, setLogout] = useState(false);
  return (
    <div>
      <div>
        <div>
          <p>admin name</p>
          <p>id</p>
        </div>
        <p>phoen numebr</p>
        <p>department</p>
      </div>
      {logout && <div>  <p> are you sure to logout?</p>
         
          <button onClick="setLogout(true)">Logout</button>
      </div>}
    </div>
  )
}