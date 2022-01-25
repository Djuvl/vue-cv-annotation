import { mount } from '@cypress/vue';
import { ref } from 'vue';
import Anno from './Annotation.vue';
import './index.css';

it('renders learn vue link', () => {
  const mode = ref(0);
  mount(Anno, {
    attrs: { class: 'h-96' },
    props: {
      src: 'https://t7.baidu.com/it/u=2701208059,2978966657&fm=193&f=GIF',
      mode: mode,
      annos: [
        {
          id: 1,
          type: 0,
          cat: 10,
          outline: 2,
          title: 'pt',
          data: [
            [
              [10, 10],
              [100, 100],
              [10, 100],
            ],
          ],
        },
      ],
    },
  });
  cy.cyGet('painter')
    .should('exist')
    .click(10, 10)
    .within(() => {
      cy.get('circle').should('have.length', 1);
      cy.root()
        .trigger('mousedown', { button: 0, which: 1, offsetX: 10, offsetY: 100 })
        .trigger('mousemove', { button: 0, which: 1, offsetX: 100, offsetY: 100 })
        .trigger('mouseup')
        .get('circle')
        .should('have.length', 2);
      cy.root().click(100, 10).rightclick(100, 10).get('circle').should('have.length', 2);
    });
});
