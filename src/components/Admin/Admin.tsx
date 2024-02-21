import './Admin.scss'
import TextEditor from "./TextEditor.tsx";
import ImageUpload from "./ImageUpload.tsx";

function Admin() {
  return (
    <section id={'admin'} data-scroll={'admin'} className={'admin-container'}>
      <div className={'admin-content'}>
        <form>
          <div className={'item'}>
            <span>Otsikko:</span>
            <input type="text" name="name"/>
          </div>
          <div className={'item'}>
            <span>Lisää kuva:</span>
            <ImageUpload/>
          </div>
          <div className={'item'}>
            Postauksen teksti:
            <TextEditor/>
          </div>
          <br/>
          <input type="submit" value="Lähetä"/>
        </form>
      </div>
    </section>
)
}

export default Admin
