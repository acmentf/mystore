# Usage

```JavaScript
import linkagePicker from '@/app/component/linkage-picker'
```

```HTML
<linkage-picker 
    title = "选择路线"  // 自定义选择器标题，可选，默认不显示
    :data = "data" // 传入的数据，必填
    :visible.sync = "visible" // 是否显示选择器，默认 false
    :keys = "keys" // 自定义传入数据对象的键名，选择器将根据键名匹配从属关系，可选，默认 { key: 'id', pkey: 'pid', label: 'label' }
    :show-cancel = "true" // 是否显示取消按钮，默认 true
    :show-confirm = "true" // 是否显示确定按钮，默认 true
    @change = "change" // 监听全部选择完成和点击确定的事件，返回 function(data, done)，done为隐藏选择器方法，需手动调用
>
</linkage-picker>
```

```JavaScript
export default {
    components: {
        linkagePicker
    },
    methods: {
        change(data, done) {
            console.log(data)
            done()
        }
    },
    data() {
        return {
            visible: false,
            keys: {
                key: 'id',
                pkey: 'pid',
                label: 'label'
            },
            data: [
                [
                    {
                        label: '全部',
                        id: 0
                    },
                    {
                        label: '华中区',
                        id: 1
                    },
                    {
                        label: '华东区',
                        id: 2
                    },
                    {
                        label: '华南区',
                        id: 3
                    }
                ],
                [
                    {
                        label: '全部',
                        id: 0
                    },
                    {
                        label: '北京市',
                        id: 11,
                        pid: 1
                    },
                    {
                        label: '湖南省',
                        id: 12,
                        pid: 1
                    },
                    {
                        label: '湖北省',
                        id: 13,
                        pid: 3
                    }
                ],
                [
                    {
                        label: '全部',
                        id: 0
                    },
                    {
                        label: '太平区',
                        id: 111,
                        pid: 11
                    },
                    {
                        label: '宣武区',
                        id: 112,
                        pid: 12
                    },
                    {
                        label: '东申区',
                        id: 113,
                        pid: 13
                    }
                ]
            ]
        }
    }
}