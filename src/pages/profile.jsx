export default function Profile() {
  const [logout, setLogoutg] = useState(false);
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
      {logout && <p> are you sure to logout?</p>
      <button onClick="setLogut(true)">Logout</button>}
    </div>
  )
}