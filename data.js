const categories = [
  'Бесплатные материалы',
  'Онлайн-конференции',
  'Для руководителей',
  'Для собственников',
  'Для специалистов',
  'Для спикеров',
];

`

INSERT INTO "QuizOptionsCategories" ("title", "subtitle", "isMultipleChoice", "createdAt", "updatedAt") values ('Ваша сфера деятельности', 'Выберите область, которая вам интересна (можно выбрать несколько сфер)', true, current_timestamp, current_timestamp);
INSERT INTO "QuizOptionsCategories" ("title", "subtitle", "isMultipleChoice", "createdAt", "updatedAt") values ('Ваша позиция', 'Выберите вашу роль в бизнесе', false, current_timestamp, current_timestamp);
INSERT INTO "QuizOptionsCategories" ("title", "subtitle", "isMultipleChoice", "createdAt", "updatedAt") values ('Ваши ожидания от обучения', 'Укажите ваши цели (можно выбрать несколько)', true, current_timestamp, current_timestamp);


INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (1, 'Фитнес', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (1, 'Ресторанный бизнес', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (1, 'Туризм', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (1, 'Пока не знаю', current_timestamp, current_timestamp);

INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (2, 'Рядовой сотрудник', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (2, 'Руководитель', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (2, 'Собственник бизнеса', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (2, 'Спикер', current_timestamp, current_timestamp);

INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (3, 'Повысить уровень компетенций', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (3, 'Получить повышение', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (3, 'Увеличить прибыль', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (3, 'Открыть свое дело', current_timestamp, current_timestamp);
INSERT INTO "QuizOptions" ("categoryId", "option", "createdAt", "updatedAt") values (3, 'Масштабировать бизнес', current_timestamp, current_timestamp);


INSERT INTO "CourseSections" ("section", "createdAt", "updatedAt") values ('Бесплатные материалы', current_timestamp, current_timestamp);
INSERT INTO "CourseSections" ("section", "createdAt", "updatedAt") values ('Онлайн-конференции', current_timestamp, current_timestamp);
INSERT INTO "CourseSections" ("section", "createdAt", "updatedAt") values ('Для руководителей', current_timestamp, current_timestamp);
INSERT INTO "CourseSections" ("section", "createdAt", "updatedAt") values ('Для собственников', current_timestamp, current_timestamp);
INSERT INTO "CourseSections" ("section", "createdAt", "updatedAt") values ('Для специалистов', current_timestamp, current_timestamp);
INSERT INTO "CourseSections" ("section", "createdAt", "updatedAt") values ('Для спикеров', current_timestamp, current_timestamp);


INSERT INTO "CourseFilterOptions" ("title", "createdAt", "updatedAt") values ('Фитнес', current_timestamp, current_timestamp);
INSERT INTO "CourseFilterOptions" ("title", "createdAt", "updatedAt") values ('Рестораны', current_timestamp, current_timestamp);
INSERT INTO "CourseFilterOptions" ("title", "createdAt", "updatedAt") values ('Туризм', current_timestamp, current_timestamp);


INSERT INTO "Courses" ("sectionId", "filterId", "title", "description", "createdAt", "updatedAt") values (1, 1, 'Курс - фитнес', 'Произвольно длинное описание курса', current_timestamp, current_timestamp);
INSERT INTO "Courses" ("sectionId", "filterId", "title","description", "createdAt", "updatedAt") values (1, 1, 'Курс - рестораны', 'Произвольно длинное описание курса', current_timestamp, current_timestamp);
INSERT INTO "Courses" ("sectionId", "filterId", "title","description", "createdAt", "updatedAt") values (1, 1, 'Курс - туризм', 'Произвольно длинное описание курса', current_timestamp, current_timestamp);
INSERT INTO "Courses" ("sectionId", "filterId", "title","description", "createdAt", "updatedAt") values (2, 2, 'Онлайн-конференции - фитнес', 'Произвольно длинное описание курса', current_timestamp, current_timestamp);
INSERT INTO "Courses" ("sectionId", "filterId", "title","description", "createdAt", "updatedAt") values (2, 2, 'Онлайн-конференции - рестораны', 'Произвольно длинное описание курса', current_timestamp, current_timestamp);
INSERT INTO "Courses" ("sectionId", "filterId", "title","description", "createdAt", "updatedAt") values (2, 2, 'Онлайн-конференции - туризм', 'Произвольно длинное описание курса', current_timestamp, current_timestamp);
INSERT INTO "Courses" ("sectionId", "filterId", "title","description", "createdAt", "updatedAt") values (3, 3, 'Для руководителей - фитнес', 'Произвольно длинное описание курса', current_timestamp, current_timestamp);


INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (1, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Как открыть фитнес-клуб с двойки', 'Произвольно длинное описание урока', 2715, 1, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', true, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (1, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Как открыть фитнес-клуб с единицы', 'Произвольно длинное описание урока', 2715, 2, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', true, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (null, 2 , 1,'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Как открыть фитнес-клуб с нуля', 'Произвольно длинное описание урока', 2715, 3, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', true, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (1, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Как открыть фитнес-клуб с тройки', 'Произвольно длинное описание урока', 2715, 4, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', true, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (2, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Как', 'Произвольно длинное описание урока', 2715, 11, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', true, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (2, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Зачем', 'Произвольно длинное описание урока', 2715, 10, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', false, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (3, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Продвижение в инстаграме', 'Произвольно длинное описание урока', 27150, 9, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', false, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (3, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Продвижение в тиктоке', 'Произвольно длинное описание урока', 2715, 8, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', false, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (3, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Продвижение почтовыми голубями', 'Произвольно длинное описание урока', 2715, 7, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', false, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (3, null, null, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Продвижение в очереди в поликлинике', 'Произвольно длинное описание урока', 2715, 6, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', false, current_timestamp, current_timestamp);
INSERT INTO "Lessons" ("courseId", "filterId", "sectionId", "video", "title", "description", "duration", "order", "timings", "isPaid", "createdAt", "updatedAt") values (null, 3, 2, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Как увеличить прибыль в два раза за три месяца и что-то там еще, заголовок будет сокращен', 'Произвольно длинное описание урока', 271, 5, '[{"time": "00:00", "content":"Введение"},{"time":"01:36","content":"Штат отдела продаж"}]', false, current_timestamp, current_timestamp);


INSERT INTO "SubscriptionPlans" ("term", "humanFriendlyTerm", "price", "isPopular", "isGoodOffer", "createdAt", "updatedAt") values (30, 'месяц', 990, false, false, current_timestamp, current_timestamp);
INSERT INTO "SubscriptionPlans" ("term", "humanFriendlyTerm", "price", "isPopular", "isGoodOffer", "createdAt", "updatedAt") values (90, '3 месяца', 2490, true, false, current_timestamp, current_timestamp);
INSERT INTO "SubscriptionPlans" ("term", "humanFriendlyTerm", "price", "isPopular", "isGoodOffer", "createdAt", "updatedAt") values (365, 'год', 9490, false, true, current_timestamp, current_timestamp);

INSERT INTO "Previews" ("url", "createdAt", "updatedAt") values ('cat.jpeg', current_timestamp, current_timestamp);
INSERT INTO "LessonFiles" ("title", "url", "order", "createdAt", "updatedAt") values ('Название файла', 'sample.pdf', 1, current_timestamp, current_timestamp);

INSERT INTO "GenericData" ("key", "value", "createdAt", "updatedAt") values ('email', 'email@email.ru', current_timestamp, current_timestamp);

`;
