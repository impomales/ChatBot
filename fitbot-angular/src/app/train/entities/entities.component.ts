import {Component, OnInit, DoCheck} from '@angular/core'
import {Entity} from './entity.model'
import {EntityService} from './entity.service'
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {Router, ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {
  entities: Entity[]
  createEntityForm: FormGroup
  paramId: string

  constructor(
    private entityService: EntityService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getEntities()
    this.createEntityForm = new FormGroup({
      name: new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    // TODO don't allow duplicates
    this.entities.push({
      name: this.createEntityForm.get('name').value,
      values: []
    })
    this.createEntityForm.reset()
  }

  deleteEntity(index: number) {
    // TODO delete annotations in intents.
    this.entities[index] = null
    this.entities.splice(index, 1)
    this.paramId = this.router.url.split('/')[3]
    if (+this.paramId === index) this.router.navigate(['/train/entities'])
  }

  getEntities() {
    this.entities = this.entityService.getEntities()
  }
}
